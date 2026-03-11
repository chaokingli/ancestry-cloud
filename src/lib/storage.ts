import { promises as fs } from "fs"
import path from "path"
import { NextRequest } from "next/server"
import sharp from "sharp"

// Maximum file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed image types
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

// Thumbnail dimensions
export const THUMBNAIL_SIZE = 300

/**
 * Sanitize filename to prevent path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path separators and normalize
  const safeName = path.basename(filename)
  // Replace spaces with underscores
  return safeName.replace(/\s+/g, "_")
}

/**
 * Validate file type
 */
export function isValidFileType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimeType)
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string, type: string): string {
  const sanitized = sanitizeFilename(originalName)
  const extension = path.extname(sanitized).toLowerCase()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `upload_${timestamp}_${random}${extension}`
}

/**
 * Generate thumbnail filename
 */
export function generateThumbnailFilename(originalFilename: string): string {
  const basename = path.basename(originalFilename, path.extname(originalFilename))
  return `${basename}_thumb.jpg`
}

/**
 * Resize and compress image with sharp
 */
export async function processImage(
  buffer: Buffer,
  targetPath: string,
  options: { width?: number; quality?: number } = {}
): Promise<void> {
  const { width, quality = 80 } = options

  const image = sharp(buffer)

  // Get original metadata
  const metadata = await image.metadata()

  // If original width is smaller than target width, use original width
  const resizeWidth = width && metadata.width ? Math.min(width, metadata.width) : width

  const operations = image.jpeg({ quality })

  if (resizeWidth && metadata.width && metadata.width > resizeWidth) {
    operations.resize({
      width: resizeWidth,
      withoutEnlargement: true,
    })
  }

  await operations.toFile(targetPath)
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const extensionMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  }
  return extensionMap[mimeType] || ".jpg"
}

/**
 * Save uploaded file locally
 */
export async function saveLocalFile(
  buffer: Buffer,
  filename: string,
  directory: string
): Promise<string> {
  const safeFilename = sanitizeFilename(filename)
  const uniqueFilename = generateUniqueFilename(safeFilename, "image")
  const filePath = path.join(directory, uniqueFilename)

  try {
    // Ensure directory exists
    await fs.mkdir(directory, { recursive: true })

    // Write file
    await fs.writeFile(filePath, buffer)

    return uniqueFilename
  } catch (error) {
    throw new Error(`Failed to save file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Create thumbnail from image buffer
 */
export async function createThumbnail(
  buffer: Buffer,
  thumbnailDir: string,
  originalFilename: string
): Promise<string> {
  const thumbnailFilename = generateThumbnailFilename(originalFilename)
  const thumbnailPath = path.join(thumbnailDir, thumbnailFilename)

  try {
    // Ensure directory exists
    await fs.mkdir(thumbnailDir, { recursive: true })

    // Create thumbnail
    await processImage(buffer, thumbnailPath, {
      width: THUMBNAIL_SIZE,
      quality: 70,
    })

    return thumbnailFilename
  } catch (error) {
    throw new Error(`Failed to create thumbnail: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Handle file upload with validation
 */
export async function handleUpload(
  request: NextRequest
): Promise<{
  success: boolean
  filename?: string
  thumbnail?: string
  size?: number
  error?: string
}> {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    if (!isValidFileType(file.type)) {
      return { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }
    }

    // Validate file size
    if (!isValidFileSize(file.size)) {
      return { success: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` }
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save original file
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    const filename = await saveLocalFile(buffer, file.name, uploadsDir)

    // Create thumbnail
    const thumbnailDir = path.join(process.cwd(), "public", "uploads", "thumbnails")
    const thumbnail = await createThumbnail(buffer, thumbnailDir, filename)

    return {
      success: true,
      filename,
      thumbnail,
      size: file.size,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Validate upload request before processing
 */
export function validateUploadRequest(request: NextRequest): { valid: boolean; error?: string } {
  if (request.method !== "POST") {
    return { valid: false, error: "Method not allowed" }
  }

  // Check content type
  const contentType = request.headers.get("content-type")
  if (contentType && contentType.includes("multipart/form-data")) {
    return { valid: true }
  }

  return { valid: false, error: "Invalid content type" }
}

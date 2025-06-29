# Video Processing API

## Design Choices

### Database Schema
- **PostgreSQL with Prisma ORM**: Chosen for ACID compliance and type-safe database operations
- **Video Model**: Stores file path, processing status, and timestamps with UUID primary keys
- **Annotation Model**: Related to videos with cascade deletion, stores bounding box coordinates and detection types
- **Enums**: Status (PENDING/PROCESSING/COMPLETE/FAILED) and Type (face/license_plate) for data consistency

### API Structure
- **RESTful design**: Clear resource-based endpoints following REST conventions
- **Asynchronous processing**: Upload returns immediately, processing happens in background
- **Status tracking**: Separate endpoint to check processing progress
- **CRUD for annotations**: Full management of annotation data after processing
- **Consistent response format**: Standardized success/error responses with proper HTTP status codes

### Architecture
- **Background job processing**: BullMQ with Redis for reliable video processing queue
- **Validation layer**: Zod schemas for type-safe input validation
- **Error handling**: Global error handler with consistent error responses
- **File handling**: Multer for multipart uploads with MIME type validation

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Docker & Docker Compose

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start PostgreSQL and Redis with Docker Compose**
   ```bash
   docker compose up -d
   ```

3. **Environment configuration**
   Create `.env` file:
   ```bash
   PORT=5000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/evidence"
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

### Running the Project

1. **Start background worker**
   ```bash
   pnpm run worker
   ```

2. **Start API server**
   ```bash
   pnpm run dev
   ```

API will be available at `http://localhost:5000`

### API Endpoints

- `POST /api/videos` - Upload video file
- `GET /api/videos/:videoId/status` - Check processing status  
- `GET /api/videos/:videoId/annotations` - Get annotations (after processing complete)
- `PUT /api/videos/:videoId/annotations` - Update annotations

### Testing with Postman

**Upload Video**
- Method: POST
- URL: `http://localhost:5000/api/videos`
- Body: form-data, key: "video", value: select video file

**Check Status**
- Method: GET
- URL: `http://localhost:5000/api/videos/{videoId}/status`

**Get Annotations**
- Method: GET  
- URL: `http://localhost:5000/api/videos/{videoId}/annotations`

**Update Annotations**
- Method: PUT
- URL: `http://localhost:5000/api/videos/{videoId}/annotations`
- Headers: Content-Type: application/json
- Body: raw JSON
```json
{
  "annotations": [
    {
      "frameNumber": 100,
      "x": 150,
      "y": 200, 
      "width": 50,
      "height": 75,
      "type": "face"
    }
  ]
}
```

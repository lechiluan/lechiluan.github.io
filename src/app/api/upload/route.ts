export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const imageUrl = url.searchParams.get('url');

        // Handle URL-based image uploads (pasted URLs)
        if (imageUrl) {
            return Response.json({
                success: 1,
                file: {
                    url: imageUrl,
                },
            });
        }

        // Handle file uploads
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return Response.json(
                { success: 0, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        return Response.json({
            success: 1,
            file: {
                url: dataUrl,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return Response.json(
            { success: 0, error: 'Upload failed' },
            { status: 500 }
        );
    }
}

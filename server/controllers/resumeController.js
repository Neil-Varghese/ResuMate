import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';



// Controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        if (!title || title.trim().length === 0) {
            return res.status(422).json({ message: 'Resume title is required' });
        }

        const newResume = await Resume.create({ user: userId, title: title.trim() });
        return res.status(201).json({
            message: 'Resume created successfully',
            resume: newResume
        });

    } catch (error) {
        console.error('Create resume error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// Controller for deleting a resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        if (!resumeId) {
            return res.status(422).json({ message: 'Resume ID is required' });
        }

        const result = await Resume.findOneAndDelete({ _id: resumeId, user: userId });

        if (!result) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Delete resume error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// Get user resume by id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        if (!resumeId) {
            return res.status(422).json({ message: 'Resume ID is required' });
        }

        const resume = await Resume.findOne({ user: userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const result = resume.toObject();
        delete result.__v;
        delete result.createdAt;
        delete result.updatedAt;

        return res.status(200).json({ resume: result });
    } catch (error) {
        console.error('Get resume error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



// Get public resume by id
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        if (!resumeId) {
            return res.status(422).json({ message: 'Resume ID is required' });
        }

        const resume = await Resume.findOne({ public: true, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        return res.status(200).json({ resume });
    } catch (error) {
        console.error('Get public resume error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



//controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.body;
        const image = req.file;

        // resumeData may come as a JSON string when submitted as FormData
        let resumeDataRaw = req.body.resumeData;
        let removeBackground = req.body.removeBackground;

        let resumeDataCopy;
        if (typeof resumeDataRaw === 'string') {
            try {
                resumeDataCopy = JSON.parse(resumeDataRaw);
            } catch (err) {
                resumeDataCopy = {};
            }
        } else {
            resumeDataCopy = resumeDataRaw || {};
        }

        // normalize removeBackground flag (could be 'true' from FormData)
        const removeBg = removeBackground === 'true' || removeBackground === true;

        // load existing resume to support toggling background without re-uploading
        let existingResume = null;
        try {
            existingResume = await Resume.findOne({ user: userId, _id: resumeId }).lean();
        } catch (err) {
            existingResume = null;
        }

        if (image) {

            // read file into buffer for upload
            const imageBufferData = fs.readFileSync(image.path);

            // helper that tries multiple SDK method names and response shapes
            const uploadToImageKit = async (buffer, filename) => {
                const base64 = buffer.toString('base64');

                // try common method names in different SDK versions
                if (typeof imageKit.upload === 'function') {
                    return await imageKit.upload({ file: base64, fileName: filename, folder: 'user-resumes' });
                }

                if (imageKit.uploader && typeof imageKit.uploader.upload === 'function') {
                    return await imageKit.uploader.upload({ file: base64, fileName: filename, folder: 'user-resumes' });
                }

                if (imageKit.files && typeof imageKit.files.upload === 'function') {
                    return await imageKit.files.upload({ file: base64, fileName: filename, folder: 'user-resumes' });
                }

                throw new Error('ImageKit upload method not available');
            };

            let response;
            try {
                response = await uploadToImageKit(imageBufferData, image.originalname || 'resume.jpg');
            } catch (err) {
                // cleanup temp file then rethrow
                try { fs.unlinkSync(image.path); } catch(_) {}
                throw err;
            }

            // response may provide url or file path in different fields depending on SDK
            const respUrl = response?.url || response?.response?.url || '';
            const respFilePath = response?.filePath || response?.file_path || response?.file_path_name || response?.name || '';

            // Try to construct a stable original URL
            let baseUrl = '';
            if (respUrl) {
                baseUrl = respUrl;
            } else if (respFilePath) {
                // If an IMAGEKIT_URL_ENDPOINT is configured, construct the delivery URL
                const endpoint = process.env.IMAGEKIT_URL_ENDPOINT || '';
                if (!endpoint) {
                    console.error('ImageKit URL endpoint not configured');
                    return res.status(500).json({ message: 'Image upload failed: server configuration missing' });
                }
                baseUrl = `${endpoint.replace(/\/$/, '')}/${respFilePath.replace(/^\//, '')}`;
            }

            // Remove any existing query params to get the original image URL
            const originalImageUrl = baseUrl ? baseUrl.split('?')[0] : '';

            // Build transformed URL depending on removeBg flag and accent color
            let finalImageUrl = originalImageUrl;
            if (originalImageUrl) {
                const trParts = [];

                // focus on face and set a reasonable crop size
                trParts.push('w-400', 'h-400', 'fo-face');

                if (removeBg) {
                    trParts.push('e-bgremove');
                    // if an accent color is provided, set background to accent color
                    const accent = resumeDataCopy.accent_color || resumeDataCopy?.personal_info?.accent_color || '';
                    if (accent) {
                        const hex = accent.replace('#', '').toLowerCase();
                        if (hex) {
                            trParts.push(`bg-${hex}`);
                        }
                    }
                }

                if (trParts.length > 0) {
                    const tr = trParts.join(',');
                    finalImageUrl = originalImageUrl.includes('?') ? `${originalImageUrl}&tr=${tr}` : `${originalImageUrl}?tr=${tr}`;
                }
            }

            resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
            // store both original and final (transformed) URLs and the flag so toggle persists
            if (originalImageUrl) resumeDataCopy.personal_info.original_image = originalImageUrl;
            resumeDataCopy.personal_info.image = finalImageUrl || originalImageUrl || '';
            resumeDataCopy.personal_info.remove_background = !!removeBg;

            // remove temporary file uploaded by multer
            try {
                fs.unlinkSync(image.path);
            } catch (err) {
                // ignore cleanup errors
            }
        }

        // If no new image uploaded but removeBg changed, apply transformation to existing stored image
        if (!image) {
            const incomingPersonal = resumeDataCopy.personal_info || {};
            // prefer explicitly provided original_image in incoming data
            let originalFromIncoming = incomingPersonal.original_image || incomingPersonal.image || '';

            // fallback to existing resume's stored original_image or image
            const originalFromExisting = existingResume?.personal_info?.original_image || existingResume?.personal_info?.image || '';

            const originalImageUrl = (originalFromIncoming && originalFromIncoming.split('?')[0]) || (originalFromExisting && originalFromExisting.split('?')[0]) || '';

            if (originalImageUrl) {
                // build final image url just like above
                const trParts = [];
                trParts.push('w-400', 'h-400', 'fo-face');
                if (removeBg) {
                    trParts.push('e-bgremove');
                    const accent = resumeDataCopy.accent_color || resumeDataCopy?.personal_info?.accent_color || existingResume?.accent_color || '';
                    if (accent) {
                        const hex = accent.replace('#', '').toLowerCase();
                        if (hex) trParts.push(`bg-${hex}`);
                    }
                }
                const tr = trParts.join(',');
                const finalImageUrl = tr ? (originalImageUrl.includes('?') ? `${originalImageUrl}&tr=${tr}` : `${originalImageUrl}?tr=${tr}`) : originalImageUrl;

                resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
                if (!resumeDataCopy.personal_info.original_image) resumeDataCopy.personal_info.original_image = originalImageUrl;
                resumeDataCopy.personal_info.image = finalImageUrl;
                resumeDataCopy.personal_info.remove_background = !!removeBg;
            }
        }

        // Verify resume exists before updating
        const existingResumeCheck = await Resume.findOne({ user: userId, _id: resumeId });
        if (!existingResumeCheck) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Update resume with provided data
        const updatedResume = await Resume.findOneAndUpdate(
            { user: userId, _id: resumeId },
            { $set: resumeDataCopy },
            { new: true }
        );

        return res.status(200).json({ message: 'Resume saved successfully', resume: updatedResume });
    }
    catch (error) {
        console.error('Update resume error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
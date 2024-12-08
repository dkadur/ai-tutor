import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";

interface FileUploadProps {
    onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Invalid file type. Only PNG, JPG/JPEG, WEBP, and GIF are allowed.');
                event.target.value = ''; // Reset the input
                return;
            }
            if (file.size > 5242880) {
                alert('File size exceeds the 5MB limit.');
                event.target.value = ''; // Reset the input
                return;
            }
            setSelectedFile(file);
            onFileChange(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        onFileChange(null);
        (document.getElementById("image-upload") as HTMLInputElement).value = '';
    };

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="image-upload" className="text-gray-800 text-lg">Attach an image (optional)</Label>
            <div className="flex items-center gap-2">
                <Input type="file" id="image-upload" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleFileChange} />
                {selectedFile && (
                    <Button type="button" className="bg-white text-red-500 border border-red-500 px-2 hover:bg-orange-500 hover:text-white"
                            onClick={handleRemoveFile}> X
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
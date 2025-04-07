
import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EvidenceItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileUploaded: (file: EvidenceItem) => void;
}

export const FileUploader = ({ onFileUploaded }: FileUploaderProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    setSelectedFile(file);
    // Auto-fill title with filename
    setTitle(file.name.split('.')[0]);
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
  };
  
  const handleSubmit = () => {
    if (!selectedFile || !title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and select a file",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, we would upload the file to a server here
    // For now, we'll create a mock URL
    const fileUrl = URL.createObjectURL(selectedFile);
    const fileType = selectedFile.type.split('/')[0] === 'image' 
      ? 'image' 
      : (selectedFile.type.includes('pdf') ? 'document' : 'other');
    
    const newEvidence: EvidenceItem = {
      title,
      description,
      type: fileType,
      fileUrl,
    };
    
    onFileUploaded(newEvidence);
    clearSelection();
    
    toast({
      title: "Evidence Added",
      description: "Your evidence has been successfully added",
    });
  };
  
  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              Drag and drop your files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported file types: Images, PDFs, Documents, etc.
            </p>
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleChange}
            />
            <Label 
              htmlFor="file-upload"
              className="mt-2 cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Select File
            </Label>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium truncate max-w-[400px]">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({Math.round(selectedFile.size / 1024)} KB)
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={clearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evidence-title">Title</Label>
              <Input 
                id="evidence-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title for this evidence"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="evidence-description">Description (Optional)</Label>
              <Textarea 
                id="evidence-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this evidence shows or proves"
                className="min-h-20"
              />
            </div>
            
            <Button type="button" onClick={handleSubmit}>
              Add to Evidence List
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

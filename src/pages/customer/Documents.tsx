import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import { Upload, Download, Description, Add } from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';

interface Document {
  id: number;
  fileName: string;
  documentType: string;
  uploadDate: string;
  size: string;
}

interface Policy {
  policyId: number;
  policyNumber: string;
  policyName: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const documentTypes = [
    'PAN Card',
    'Aadhaar Card',
    'Bank Statement',
    'Income Proof',
    'Address Proof',
    'Photo',
    'Signature',
    'Other'
  ];

  useEffect(() => {
    fetchDocuments();
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('https://localhost:7073/api/policy/my-policies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPolicies(data);
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents...');
      const response = await fetch('https://localhost:7073/api/user/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      console.log('Documents response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Documents data:', data);
        setDocuments(data);
      } else {
        console.error('Failed to fetch documents, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType || !selectedPolicyId) return;

    console.log('Uploading document:', selectedFile.name, 'Type:', documentType, 'Policy:', selectedPolicyId);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`https://localhost:7073/api/policy/${selectedPolicyId}/upload-document?documentType=${documentType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      console.log('Upload response status:', response.status);
      const responseText = await response.text();
      console.log('Upload response:', responseText);

      if (response.ok) {
        setSnackbar({ open: true, message: 'Document uploaded successfully!', severity: 'success' });
        setUploadDialog(false);
        setSelectedFile(null);
        setDocumentType('');
        setSelectedPolicyId('');
        fetchDocuments();
      } else {
        setSnackbar({ open: true, message: `Failed to upload: ${responseText}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
    }
  };

  const handleDownload = async (documentId: number, fileName: string) => {
    try {
      const response = await fetch(`https://localhost:7073/api/user/download-document/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Box p={3}>
      <PageHeader title="My Documents" icon={<Description />} />
      
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Uploaded Documents</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setUploadDialog(true)}
          >
            Upload Document
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document Type</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">No documents uploaded yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.documentType}</TableCell>
                    <TableCell>{doc.fileName}</TableCell>
                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDownload(doc.id, doc.fileName)}
                        title="Download"
                      >
                        <Download />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Select Policy</InputLabel>
            <Select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              label="Select Policy"
            >
              {policies.map((policy) => (
                <MenuItem key={policy.policyId} value={policy.policyId}>
                  {policy.policyNumber} - {policy.policyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Document Type</InputLabel>
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              label="Document Type"
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type.replace(' ', '')}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            component="label"
            startIcon={<Upload />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
            />
          </Button>

          {selectedFile && (
            <Typography variant="body2" color="textSecondary">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || !documentType || !selectedPolicyId}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

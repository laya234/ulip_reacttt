import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: (comments?: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  requireComments?: boolean;
  commentsLabel?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requireComments = false,
  commentsLabel = 'Comments',
  severity = 'info',
}: ConfirmDialogProps) {
  const [comments, setComments] = useState('');

  const handleConfirm = () => {
    if (requireComments && !comments.trim()) {
      return;
    }
    onConfirm(comments.trim() || undefined);
    setComments('');
  };

  const handleCancel = () => {
    setComments('');
    onCancel();
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'error': return '#d32f2f';
      case 'warning': return '#ed6c02';
      case 'success': return '#2e7d32';
      default: return '#1976d2';
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: getSeverityColor() }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label={commentsLabel}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required={requireComments}
          error={requireComments && !comments.trim()}
          helperText={requireComments && !comments.trim() ? 'Comments are required' : ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={severity === 'error' ? 'error' : 'primary'}
          disabled={requireComments && !comments.trim()}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

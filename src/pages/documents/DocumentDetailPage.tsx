import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Edit,
  History,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentService } from '../../services/document';
import { Document, DocumentVersion } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [document, setDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument();
      loadVersions();
    }
  }, [id]);

  // const loadDocument = async () => {
  //   try {
  //     setLoading(true);
  //     const doc = await DocumentService.getDocument(id!);
  //     setDocument(doc);
  //   } catch (err: any) {
  //     setError('Failed to load document');
  //     console.error('Error loading document:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadDocument = async () => {
  try {
    setLoading(true);
    console.log('=== DEBUG: Loading document ===');
    console.log('Document ID from URL:', id);
    
    const doc = await DocumentService.getDocument(id!);
    console.log('=== DEBUG: Document loaded successfully ===');
    console.log('Document object:', doc);
    console.log('Document ID:', doc?.id);
    console.log('Document title:', doc?.title);
    
    setDocument(doc);
  } catch (err: any) {
    console.error('=== DEBUG: Error in loadDocument ===');
    console.error('Error details:', err);
    console.error('Error response data:', err.response?.data);
    
    setError('Failed to load document: ' + (err.response?.data?.detail || err.message));
  } finally {
    setLoading(false);
  }
};

  const loadVersions = async () => {
    try {
      const vers = await DocumentService.getDocumentVersions(id!);
      setVersions(vers);
    } catch (err) {
      console.error('Error loading versions:', err);
    }
  };

  const handleDownload = async () => {
    if (document) {
      try {
        await DocumentService.downloadDocument(document.id);
      } catch (err) {
        setError('Failed to download document');
      }
    }
  };

  const handleDelete = async () => {
    if (document) {
      try {
        await DocumentService.deleteDocument(document.id);
        navigate('/documents');
      } catch (err) {
        setError('Failed to delete document');
      }
    }
  };

  if (loading) return <LinearProgress />;
  if (!document) return <Alert severity="error">Document not found</Alert>;

  const canEdit = user?.id === document.creator?.id || user?.role === 'admin';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/documents')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Document Details
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {document.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {new Date(document.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownload}
                >
                  Download
                </Button>
                {canEdit && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/documents/${document.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {document.description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip label={document.department} color="primary" />
              {document.tags?.map((tag) => (
                <Chip key={tag.id} label={tag.name} variant="outlined" />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<History />}
                onClick={() => setVersionDialogOpen(true)}
              >
                View Version History ({versions.length})
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Document Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="File Name"
                  secondary={document.file_name}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="File Type"
                  secondary={document.fileType}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="File Size"
                  // secondary={`${(document.fileSize / 1024 / 1024).toFixed(2)} MB`}
                  secondary={"1.1 MB"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Updated"
                  secondary={new Date(document.updated_at).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Version History Dialog */}
      <Dialog
        open={versionDialogOpen}
        onClose={() => setVersionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Version History</DialogTitle>
        <DialogContent>
          <List>
            {versions.map((version) => (
              <ListItem key={version.id} divider>
                <ListItemIcon>
                  <Visibility />
                </ListItemIcon>
                <ListItemText
                  primary={`Version ${version.version_number}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {new Date(version.created_at).toLocaleDateString()}
                      </Typography>
                      {version.change_notes && (
                        <Typography variant="caption">
                          Notes: {version.change_notes}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVersionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{document.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentDetailPage;
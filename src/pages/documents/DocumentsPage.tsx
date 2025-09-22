import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  LinearProgress,
  Pagination,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Search,
  Description,
  Download,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DocumentService } from '../../services/document';
import { Document } from '../../types';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    tag: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, [currentPage, filters]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await DocumentService.getAllDocuments(currentPage, 12);
      
      let filteredDocuments = response.items;
      
      if (filters.search) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          doc.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.department) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.department === filters.department
        );
      }
      
      if (filters.tag) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.tags.some((tag: { name: string; }) => tag.name.toLowerCase().includes(filters.tag.toLowerCase()))
        );
      }
      
      setDocuments(filteredDocuments);
      
      setTotalPages(Math.ceil(filteredDocuments.length / 12));
      
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleViewDocument = (documentId: string) => {
    navigate(`/documents/${documentId}`);
  };

  const handleDownloadDocument = async (documentId: string, documentName: string) => {
    try {
      const blob = await DocumentService.downloadDocument(documentId);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = documentName || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Documents
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleUploadClick}>
          Upload Document
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Department"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Legal">Legal</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Tag"
              value={filters.tag}
              onChange={(e) => handleFilterChange('tag', e.target.value)}
            >
              <MenuItem value="">All Tags</MenuItem>
              <MenuItem value="Policy">Policy</MenuItem>
              <MenuItem value="Report">Report</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Financial">Financial</MenuItem>
              <MenuItem value="Legal">Legal</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Documents Grid */}
      <Grid container spacing={3}>
        {documents.map((document) => (
          <Grid item xs={12} sm={6} md={4} key={document.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Description color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2" noWrap>
                    {document.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {document.description?.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  <Chip label={document.department} size="small" color="primary" variant="outlined" />
                  {document.tags?.slice(0, 3).map((tag) => (
                    <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                  ))}
                </Box>
                {/* <Typography variant="caption" color="text.secondary">
                  Uploaded by {document.uploader?.firstName} {document.uploader?.lastName}
                </Typography> */}
              </CardContent>
              <CardActions>
                <IconButton 
                  size="small" 
                  onClick={() => handleViewDocument(document.id)}
                  aria-label="View document"
                >
                  <Visibility />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDownloadDocument(document.id, document.title)}
                  aria-label="Download document"
                >
                  <Download />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {documents.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No documents found
          </Typography>
        </Paper>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default DocumentsPage;
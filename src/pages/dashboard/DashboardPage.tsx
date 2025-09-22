import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  Description,
  Upload,
  People,
  TrendingUp,
  AccessTime,
  Refresh,
  Storage,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentService } from '../../services/document';
import { Document as CustomDocument, DocumentStats } from '../../types';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [recentDocuments, setRecentDocuments] = useState<CustomDocument[]>([]);
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    totalSize: 0,
    byFileType: {},
    byStatus: {
      active: 0,
      archived: 0,
      deleted: 0,
      pending: 0
    },
    recentUploads: [],
    storageUsage: {
      used: 0,
      limit: 0,
      percentage: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [docsResponse, statsResponse] = await Promise.all([
        DocumentService.getAllDocuments(1, 5),
        DocumentService.getDocumentStats(),
      ]);
      setRecentDocuments(docsResponse.items);
      setStats(statsResponse);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({
    title,
    value,
    icon,
    color,
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 2 }}>{icon}</Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleBrowseClick = () => {
    navigate('/documents');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <IconButton onClick={loadDashboardData} disabled={loading}>
          <Refresh />
        </IconButton>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Documents"
            // value={stats.totalDocuments}
            value={7}
            icon={<Description />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: '#2e7d32', mr: 2 }}><Storage /></Box>
                <Typography variant="h6" component="div">
                  Storage Used
                </Typography>
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {/* {formatFileSize(stats.totalSize)} */}
                {"50.7 MB"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {/* {Math.round(stats.storageUsage.percentage)}% of {formatFileSize(stats.storageUsage.limit)} */}
                {"1.25% of 4 GB"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Docs"
            // value={stats.byStatus.active}
            value={7}
            icon={<TrendingUp />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="File Types"
            // value={Object.keys(stats.byFileType).length}
            value={1}
            icon={<Description />}
            color="#9c27b0"
          />
        </Grid>

        {/* Recent Documents */}
        {/* <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Uploads
            </Typography>
            <List>
              {stats.recentUploads && stats.recentUploads.length > 0 ? (
                stats.recentUploads.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemIcon>
                      <Description color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Chip
                            label={doc.fileType}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent uploads" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid> */}

        {/* File Type Breakdown */}
        {/* <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              File Types
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {stats.byFileType && Object.entries(stats.byFileType).length > 0 ? (
                Object.entries(stats.byFileType).map(([fileType, count]) => (
                  <Box key={fileType} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{fileType}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">PDF</Typography>
              )}
            </Box>
          </Paper>
        </Grid> */}

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="contained" startIcon={<Upload />} onClick={handleUploadClick}>
                Upload Document
              </Button>
              <Button variant="outlined" startIcon={<Description />} onClick={handleBrowseClick}>
                Browse Documents
              </Button>
              <Button variant="outlined" startIcon={<People />} onClick={handleSearchClick}>
                Search Documents
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
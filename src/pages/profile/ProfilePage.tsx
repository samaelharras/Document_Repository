import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {user ? (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">
                  Department
                </Typography>
                <Chip label={user.department || 'N/A'} color="primary" />
              </Grid>
              {/* Add more fields as needed */}
            </Grid>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No user information available.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
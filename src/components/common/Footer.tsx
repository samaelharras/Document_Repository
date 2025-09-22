import React from 'react';
import { Box, Container, Typography, Link, Divider, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Email } from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Document Repository. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Built with React & FastAPI
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              href="https://github.com/your-username/document-repository"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <GitHub fontSize="small" />
            </IconButton>
            
            <IconButton
              size="small"
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <LinkedIn fontSize="small" />
            </IconButton>
            
            <IconButton
              size="small"
              href="mailto:support@documentrepo.com"
              aria-label="Email support"
            >
              <Email fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Link
            href="/privacy"
            variant="body2"
            color="text.secondary"
            underline="hover"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            variant="body2"
            color="text.secondary"
            underline="hover"
          >
            Terms of Service
          </Link>
          <Link
            href="/support"
            variant="body2"
            color="text.secondary"
            underline="hover"
          >
            Support
          </Link>
          <Link
            href="/documentation"
            variant="body2"
            color="text.secondary"
            underline="hover"
          >
            Documentation
          </Link>
        </Box>

        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          Version {process.env.REACT_APP_VERSION || '1.0.0'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
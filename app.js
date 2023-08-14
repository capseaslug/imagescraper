import React, { useState } from 'react';
import './App.css';
import scrapeImages from './imageScraper'; // Update the path accordingly
import {
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { CloudDownload, Done, Error } from '@mui/icons-material';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [numImages, setNumImages] = useState(10);
  const [includeTags, setIncludeTags] = useState('');
  const [excludeTags, setExcludeTags] = useState('');
  const [scrapingStatus, setScrapingStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleScrapeImages = async () => {
    setScrapingStatus('');
    setIsLoading(true);

    try {
      await scrapeImages(searchTerm, numImages, includeTags, excludeTags);
      setScrapingStatus('Scraping completed');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error scraping images:', error);
      setScrapingStatus('Scraping failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h4">Image Scraper</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search Term"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          {/* ... More Grid items for other input fields */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleScrapeImages}
              startIcon={isLoading ? <CircularProgress size={20} /> : <CloudDownload />}
            >
              Scrape Images
            </Button>
          </Grid>
          <Grid item xs={12}>
            {scrapingStatus && (
              <Typography color={scrapingStatus === 'Scraping completed' ? 'success' : 'error'}>
                {scrapingStatus}{' '}
                {scrapingStatus === 'Scraping completed' ? <Done fontSize="small" /> : <Error fontSize="small" />}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message="Scraping completed"
        />
      </header>
    </div>
  );
}

export default App;

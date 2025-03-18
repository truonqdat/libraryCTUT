import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardMedia, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import newsServices from '../services/newsServices';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';

function NewsDetail(props) {
  const [news, setNews] = React.useState([]);

  const { id } = useParams();

  const navigate = useNavigate();

  React.useEffect(() => {
    const detailNews = async () => {
      try {
        const getNews = await newsServices.getNews(id);
        setNews(getNews);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    detailNews();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexDirection: "column",
        mt: 4,
        margin: "10px auto",
        width: '1100px'
      }}
    >
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon sx={{color: 'primary.main'}}/>}
        onClick={handleGoBack}
        sx={{
          alignSelf: "start",
          justifyContent: "flex-end",
          width: "50px",
          mb: 2,
          position: 'absolute',
          top: '148px',
          bgcolor: '#fff',
          margin: '0 10px'
        }}
      ></Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "primary.main",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)",
          borderRadius: '4px 4px 0 0',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{color: "#fff", padding: '10px 0', margin: "0", textTransform: 'uppercase'}}>
          Chi tiết tin tức
        </Typography>
      </Box>
      <Card
        sx={{
          width: "100%",
          minWidth: 900,
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)",
          borderRadius: '0 0 4px 4px',
        }}
      >
        <Box
          sx={{
            display: "flex",
            flex: 1,
            p: '10px 32px',
            fontWeight: '700'
          }}
        >
            <Typography component="div" variant="h4">
              {news.title}
            </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            p: '0 32px',
            flexDirection: 'row',
            gap: '100px'
          }}
        >
            <Typography component="div" style={{ display: 'flex', gap: '5px' }}>
              <VisibilityIcon/>{news.view}
            </Typography>
            <Typography component="div" style={{ display: 'flex', gap: '5px' }}>
              <EventIcon/>{news.dayCreated}
            </Typography>
        </Box>
        <Box sx={{ p: '15px 32px 20px', lineHeight: '1.5'}}>
            <div dangerouslySetInnerHTML={{ __html: news.content }}/>
        </Box>
      </Card>
    </Box>
  );
}

export default NewsDetail;

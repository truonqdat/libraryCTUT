import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function Contact({ name, description, time }) {
  return (
    <Card sx={{ width: '95%', margin: '16px auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
          <strong>Thời gian:</strong> {time}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Contact;

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist/leave-management-frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/leave-management-frontend/browser/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});

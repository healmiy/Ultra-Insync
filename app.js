const express = require('express')
const app = express()
const port = 8080; 

app.get('/api/search', (req, res) => {
  res.status(200).send('Search is now handled on the client side with FlexSearch.');
})

app.use(express.static('dist'))

app.get('*', (req, res) => {
  res.redirect("/404")
})

app.listen(port, () => {
  console.log(`Digital garden running on port ${port}`)
})
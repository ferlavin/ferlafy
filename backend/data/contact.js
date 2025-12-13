import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  
  console.log('Mensaje de contacto recibido:');
  console.log({ name, email, message });
  
  res.json({ 
    success: true, 
    message: 'Mensaje recibido correctamente' 
  });
});

export default router;
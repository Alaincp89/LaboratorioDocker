import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Definimos el modelo Encuesta
const Encuesta = mongoose.model('Encuesta', new mongoose.Schema({
  nombre: String,
  email: String,
  edad: String,  
  serieFavorita: String,
  vos: String,
  dispositivo: [String],
  razonAmor: String
}))

const app = express()

// Middleware para manejar datos del formulario
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


mongoose.connect('mongodb://acervantes:password@my_mongo:27017/miapp?authSource=admin')


app.get('/encuesta', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'encuesta.html'));
})


app.post('/encuesta', async (req, res) => {
  const { nombre, email, edad, serieFavorita, vos, dispositivo, razonAmor } = req.body
  console.log('Recibiendo respuesta de encuesta...')
  

  await Encuesta.create({ 
    nombre, 
    email, 
    edad, 
    serieFavorita, 
    vos, 
    dispositivo: dispositivo || [], 
    razonAmor 
  })

  res.send(`
    <h1>¡Gracias por participar!</h1>
    <p>Tu voto por ${serieFavorita} ha sido registrado correctamente.</p>
    <a href="/encuesta">Volver a la encuesta</a>
    <a href="/">Listar encuestas</a>
  `)
})


app.get('/encuestas', async (_req, res) => {
  const encuestas = await Encuesta.find()
  res.send(encuestas)
})

app.get('/', async (_req, res) => {
  console.log('listando... encuesta..')
  try {
    const encuestas = await Encuesta.find(); 
    res.json(encuestas); 
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de la encuesta.' });
  }
});

app.listen(3000, () => console.log('Listening on port 3000...'))



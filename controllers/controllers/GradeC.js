const Grade = require('../models/Grade.js');

// Créer un grade
const createGrade = async (req, res) => {
    try {
      const newGrade = await Grade.create({
        grade_name: 'Débutant',  // Initialisation par défaut
        min_stars: 0,            // Initialise à 0
        max_stars: 100,          // Limite supérieure pour le grade "Débutant"
        min_sales: 0,            // Initialise à 0
        max_sales: 10,           // Limite supérieure pour le grade "Débutant"
        rewards: 'Badge, accès aux statistiques de ses recommandations',  // Récompenses pour "Débutant"
      });
      res.status(201).json({ id: newGrade.id, message: 'Grade created successfully with default values' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create grade' });
    }
  };
  

// Lire les informations d'un grade
const getGradeById = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findByPk(id);
    if (grade) {
      res.status(200).json(grade);
    } else {
      res.status(404).json({ error: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve grade' });
  }
};

const getGradeCart= async (req,res)=>{
  const {id} = req.params;
  try{
    const grade = await Grade.findByPk(id);
    if(grade){
      res.status(200).json( 
       {titre : grade.grade_name,
        stars : grade.min_stars,
        sales : grade.min_sales
      }
      );
    }
    else{
      res.status(404).json({error: 'Grade not found'});
    }
  }catch(error){

  }
}

// Obtenir tous les grades
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve grades' });
  }
};

// Mettre à jour un grade
const updateGrade = async (req, res) => {
  const { id } = req.params;
  const { grade_name, min_stars, max_stars, min_sales, max_sales, rewards } = req.body;

  try {
    const grade = await Grade.findByPk(id);
    if (grade) {
      grade.grade_name = grade_name || grade.grade_name;
      grade.min_stars = min_stars || grade.min_stars;
      grade.max_stars = max_stars !== undefined ? max_stars : grade.max_stars;
      grade.min_sales = min_sales || grade.min_sales;
      grade.max_sales = max_sales !== undefined ? max_sales : grade.max_sales;
      grade.rewards = rewards || grade.rewards;
      await grade.save();
      res.status(200).json({ message: 'Grade updated successfully', grade });
    } else {
      res.status(404).json({ error: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grade' });
  }
};

// Supprimer un grade
const deleteGrade = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findByPk(id);
    if (grade) {
      await grade.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grade' });
  }
};

module.exports = {
  createGrade,
  getGradeById,
  getAllGrades,
  updateGrade,
  deleteGrade,
  getGradeCart,
};

const express = require('express');

const router = express.Router();

const { readContentFile, writeContentFile } = require('../helpers/readWriteFile');

const { 
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
} = require('../middlewares/validations.js');

const talkerData = './talker.json';

router.get('/', async (_req, res) => {
  const talkers = await readContentFile(talkerData);

  res.status(200).json(talkers);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readContentFile(talkerData);

  const findId = talkers.find((talker) => talker.id === +id);

  if (!findId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(findId);
});

router.post(
  '/',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const talkers = await readContentFile(talkerData);

    const newTalker = {
      ...req.body,
      id: talkers.length + 1,
    };

    const newTalkerData = [...talkers, newTalker];

    await writeContentFile(talkerData, newTalkerData);

    res.status(201).json(newTalker);
  },
);

router.put(
  '/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;

    const talkers = await readContentFile(talkerData);

    const talkersFiltered = talkers.filter((talker) => talker.id !== +id);

    const talkerChanged = {
      ...req.body,
      id: +id,
    };

    const changeTalker = [...talkersFiltered, talkerChanged];

    await writeContentFile(talkerData, changeTalker);
    
    res.status(200).json(talkerChanged);
  },
);

router.delete('/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const talkers = await readContentFile(talkerData);

  const talkersFiltered = talkers.filter((talker) => talker.id !== +id);

  await writeContentFile(talkerData, talkersFiltered);

  res.status(204).end();
});

module.exports = router;

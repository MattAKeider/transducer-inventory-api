const { getTransducers } = require('../../controllers/transducer-controller');
const Transducer = require('../../models/transducer');

jest.mock('../../models/transducer');

const req = {};

const res = {
  status: jest.fn((x) => x).mockReturnThis(),
  json: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

describe('getTransducers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get all transducers', async () => {
    jest.mocked(Transducer.find).mockResolvedValueOnce(transducerDocuments);
    await getTransducers(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ transducers: transducerDocuments });
  });

  test('should fail to query the database', async () => {
    jest.mocked(Transducer.find).mockRejectedValueOnce();
    await getTransducers(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not query from database')
    );
  });
});

const transducerDocuments = [
  {
    _id: '65c5412da9eedba40a62bf43',
    name: 'TW',
    location: 'CROCKER',
    department: 'MFM',
    transducerType: 'TV',
    room: '201',
    serialNumber: '212',
    internalIdentifier: '41',
    controlNumber: '00FB-12346',
    dateReceived: '2024-01-22T00:00:00.000Z',
    outOfService: false,
    currentCondition: [],
    __v: 0,
    id: '65c5412da9eedba40a62bf43',
    toObject: jest.fn().mockReturnThis(),
  },
  {
    _id: '65c5415edb89d82f5b584d6a',
    name: 'TWz',
    location: 'CROCKER',
    department: 'MFM',
    transducerType: 'TV',
    room: '201',
    serialNumber: '212',
    internalIdentifier: '41',
    controlNumber: '00FB-12346',
    dateReceived: '2024-01-22T00:00:00.000Z',
    outOfService: false,
    currentCondition: [],
    __v: 0,
    id: '65c5415edb89d82f5b584d6a',
    toObject: jest.fn().mockReturnThis(),
  },
];

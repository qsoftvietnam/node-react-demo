import { Hospitals } from './../Models';

class Hospital {
	//=== constructor ===
	constructor() {

	}

	//=== Get all hospitals ===
	list(req, res) {
		Hospitals.find().then(datas=>{
			return res.status(200).json(datas);
		},err=>{
			return res.status(400).send(err);
		});
		
	}

	create(req, res) {
		let hospital = new Hospitals(req.body);
		hospital.save().then(data => {
			return res.json(data);
		}, err => {
			return res.status(400).send(err);
		});
	}
}

export default new Hospital();
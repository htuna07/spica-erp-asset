import * as Bucket from "@spica-devkit/bucket";

const APIKEY = "";
const MATERIAL_BUCKET = "";


Bucket.initialize({ apikey: APIKEY })
export function onWorkInsert(change) {
	const work = change.current;
	if (!work.costs || !work.costs.length) {
		return;
	}

	const promises = [];
	for (const cost of work.costs) {
		const existingMaterial = Bucket.data.get(MATERIAL_BUCKET, cost.material_id);
		const materialUpdate = existingMaterial.then(material =>
			Bucket.data.patch(MATERIAL_BUCKET, cost.material_id, { remains: material.remains - cost.amount }).catch(e => {
				console.error(`Error occured while patching material ${cost.material_id}.` + e)
			})
		)
		promises.push(materialUpdate)
	}

	return Promise.all(promises)
}
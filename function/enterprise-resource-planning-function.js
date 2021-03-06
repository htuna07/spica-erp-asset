import * as Bucket from "@spica-devkit/bucket";

const APIKEY = "";
const MATERIAL_BUCKET = "";


Bucket.initialize({ apikey: APIKEY })
export function onTaskInsert(change) {
	const task = change.current;
	if (!task.costs || !task.costs.length) {
		return;
	}

	const promises = [];
	for (const cost of task.costs) {
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

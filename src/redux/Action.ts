export const Action = {
	changeComponent: {
		type: "CHANGE_COMPONENT",
		payload: {
			fun: {
				rename: "CHANGE_COMPONENT__ANIME_RENAME",
				fuelWorker: "CHANGE_COMPONENT__FUEL_WORKER",
				stopApps: "CHANGE_COMPONENT__STOP_APPS",
				systemMonitor: "CHANGE_COMPONENT__SYSTEM_MONITOR"
			},
			dev: {
				startServers: "CHANGE_COMPONENT__WEB_START_SERVER"
			},
			NONE: "CHANGE_COMPONENT__NONE"
		}
	},

	systemMonitor: {
		changeSpeed: {
			type: "SYSTEM_MONITOR__CHANGE_SPEED",
			payload: {
				min: Infinity,
				lower: 4,
				low: 2,
				normal: 1,
				high: 0.5,
				highest: 0.25,
				max: 0.2,
			}
		},


	},

	fuelFinder: {
		changeFuel: {type: "FUEL_FINDER__CHANGE_FUEL"},
		changeFormat: {type: "FUEL_FINDER__CHANGE_FORMAT"},
		changeCp: {type: "FUEL_FINDER__CHANGE_CP"},
		reorder: {type: "FUEL_FINDER__REORDER"},
		changeSorter: {type: "FUEL_FINDER__CHANGE_SORTER"}


	}
};


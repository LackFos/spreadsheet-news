export function useState<T>(initialValue: T): [() => T, (value: T) => void] {
	// Persistent state
	let state = initialValue;

	// Function to retrieve the latest state value
	const getState = () => state;

	// Function to update the state value
	const setState = (newValue: T) => {
		state = newValue;
	};

	// Return the getter and setter
	return [getState, setState];
}

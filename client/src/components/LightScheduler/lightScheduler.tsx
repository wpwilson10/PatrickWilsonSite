import { useState } from "react";
import { Table, Form, Container, Button, InputGroup } from "react-bootstrap";

export const LightScheduler = () => {
	const [schedule, setSchedule] = useState([
		{ id: 1, time: "00:00", warmBrightness: 20, coolBrightness: 15 },
		{ id: 2, time: "06:00", warmBrightness: 60, coolBrightness: 50 },
		{ id: 3, time: "12:00", warmBrightness: 100, coolBrightness: 90 },
		{ id: 4, time: "18:00", warmBrightness: 40, coolBrightness: 30 },
		{ id: 5, time: "24:00", warmBrightness: 20, coolBrightness: 10 },
	]);

	const [newTime, setNewTime] = useState("");
	const [newWarmBrightness, setNewWarmBrightness] = useState("");
	const [newCoolBrightness, setNewCoolBrightness] = useState("");

	const handleInputChange = (id: number, type: string, value: string) => {
		const updatedSchedule = schedule.map((entry) =>
			entry.id === id
				? {
						...entry,
						[type]: Math.min(100, Math.max(0, Number(value))), // Clamp values to 0-100
				  }
				: entry
		);
		setSchedule(updatedSchedule);
	};

	const handleRemoveRow = (id: number) => {
		setSchedule(schedule.filter((entry) => entry.id !== id));
	};

	const handleAddRow = () => {
		if (newTime && newWarmBrightness !== "" && newCoolBrightness !== "") {
			const newRow = {
				id: Date.now(),
				time: newTime,
				warmBrightness: Math.min(
					100,
					Math.max(0, Number(newWarmBrightness))
				),
				coolBrightness: Math.min(
					100,
					Math.max(0, Number(newCoolBrightness))
				),
			};

			const updatedSchedule = [...schedule, newRow].sort((a, b) =>
				a.time.localeCompare(b.time)
			);
			setSchedule(updatedSchedule);
			setNewTime("");
			setNewWarmBrightness("");
			setNewCoolBrightness("");
		}
	};

	return (
		<Container
			id="light_scheduler"
			className="content-container mb-3 py-3 px-3"
		>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Time</th>
						<th>Warm Brightness</th>
						<th>Cool Brightness</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{schedule.map((entry) => (
						<tr key={entry.id}>
							<td>{entry.time}</td>
							<td>
								<Form.Control
									type="number"
									value={entry.warmBrightness}
									min="0"
									max="100"
									onChange={(e) =>
										handleInputChange(
											entry.id,
											"warmBrightness",
											e.target.value
										)
									}
								/>
							</td>
							<td>
								<Form.Control
									type="number"
									value={entry.coolBrightness}
									min="0"
									max="100"
									onChange={(e) =>
										handleInputChange(
											entry.id,
											"coolBrightness",
											e.target.value
										)
									}
								/>
							</td>
							<td>
								<Button
									variant="danger"
									size="sm"
									onClick={() => handleRemoveRow(entry.id)}
								>
									X
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<h5>Add a New Row</h5>
			<InputGroup className="mb-3">
				<Form.Control
					type="time"
					value={newTime}
					onChange={(e) => setNewTime(e.target.value)}
				/>
				<Form.Control
					type="number"
					placeholder="Warm Brightness"
					value={newWarmBrightness}
					min="0"
					max="100"
					onChange={(e) => setNewWarmBrightness(e.target.value)}
				/>
				<Form.Control
					type="number"
					placeholder="Cool Brightness"
					value={newCoolBrightness}
					min="0"
					max="100"
					onChange={(e) => setNewCoolBrightness(e.target.value)}
				/>
				<Button variant="primary" onClick={handleAddRow}>
					Add
				</Button>
			</InputGroup>
		</Container>
	);
};

export default LightScheduler;

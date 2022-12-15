import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { increment, incrementByAmount, zero } from "./counterReducer";

interface ButtonProps {
	text: string;
	/** function that doesn't take or return anything (VERY COMMON) */
	handleClick: () => void;
}

const Button = (props: ButtonProps) => (
	<button onClick={props.handleClick}>{props.text}</button>
);

const Display = ({ value }: { value: number }) => <div>{value}</div>;

export const Counter = () => {
	const dispatch = useAppDispatch();
	const count = useSelector((state: RootState) => state.counter.value);

	return (
		<div>
			<Display value={count} />
			<Button
				handleClick={() => dispatch(incrementByAmount(1000))}
				text="thousand"
			/>
			<Button handleClick={() => dispatch(zero())} text="reset" />
			<Button
				handleClick={() => dispatch(increment())}
				text="increment"
			/>
		</div>
	);
};

export type ScoreProps = {
  value: number;
};

const Score = (props: ScoreProps) => {
  const { value } = props;

  return (
    <span>
      <span className="font-bold">{value}</span> pts
    </span>
  );
};

export default Score;

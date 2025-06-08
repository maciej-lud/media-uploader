import { Box, LinearProgress, Typography } from '@mui/material';

interface LinearProgressWithLabelProps {
  value: number;
}

const LinearProgressWithLabel: React.FC<LinearProgressWithLabelProps> = ({ value }) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box width="100%">
        <LinearProgress value={value} variant="determinate" />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;

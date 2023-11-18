import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';

const PollCardMultiple = () => {
  return (
    <div className="flex min-h-[22rem] flex-col gap-2 rounded-md bg-white p-4 text-black shadow lg:p-6">
      <h1 className="font-semibold lg:text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing?
      </h1>
      <FormGroup>
        <FormLabel id="checkbok-buttons-group-label">
          Make one or more choices:
        </FormLabel>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Option 1"
        />
        <FormControlLabel control={<Checkbox />} label="Option 2" />
        <FormControlLabel control={<Checkbox />} label="Option 3" />
        <FormControlLabel control={<Checkbox />} label="Option 4" />
      </FormGroup>
    </div>
  );
};

export default PollCardMultiple;

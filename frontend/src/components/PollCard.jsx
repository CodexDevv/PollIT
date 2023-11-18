import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const PollCard = () => {
  return (
    <div className="flex min-h-[22rem] flex-col gap-4 rounded-md bg-white p-4 text-black shadow lg:p-6">
      <h1 className="font-semibold lg:text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing?
      </h1>
      {/* <form className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="radio"
            id="option1"
            name="option1"
            value="option1placeholder"
            className="checked:bg-primary checked:border-transparent"
          />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            id="option2"
            name="option2"
            value="option2placeholder"
          />
          <label htmlFor="option2">Option 2</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            id="option2"
            name="option2"
            value="option2placeholder"
          />
          <label htmlFor="option2">Option 2</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            id="option2"
            name="option2"
            value="option2placeholder"
          />
          <label htmlFor="option2">Option 2</label>
        </div>
      </form> */}
      <FormControl>
        <FormLabel id="radio-buttons-group-label">Make a choice:</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="option1"
          name="radio-buttons-group"
        >
          <FormControlLabel
            value="option1"
            control={<Radio />}
            label="Option 1"
          />
          <FormControlLabel
            value="option2"
            control={<Radio />}
            label="Option 2"
          />
          <FormControlLabel
            value="option3"
            control={<Radio />}
            label="Option 3"
          />
          <FormControlLabel
            value="option4"
            control={<Radio />}
            label="Option 4"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default PollCard;

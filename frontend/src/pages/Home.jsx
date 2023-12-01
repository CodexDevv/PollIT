import { useContext } from 'react';
import Testoasa from '../assets/OBJECTS.png';
import PollCard from '../components/PollCard';
import PollCardMultiple from '../components/PollCardMultiple';
import { PollsContext } from '../App';

const Home = () => {
  const { polls } = useContext(PollsContext);

  return (
    <div className="flex flex-col gap-4 p-2 pt-16 sm:py-4 lg:gap-16 xl:py-4">
      <div className="flex items-center justify-between">
        <p className="max-w-lg font-medium sm:text-xl md:text-2xl lg:max-w-xl lg:text-3xl">
          Opiniile sunt mai importante ca niciodată. Platformele de sondaje
          permit organizatorilor să culeagă feedback direct de la audiența lor
          și să înțeleagă mai bine nevoile și dorințele acesteia.
        </p>
        <div>
          <img src={Testoasa} alt="Testoasa" className="lg:w-[24rem]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 lg:gap-16">
        {polls.map(poll => {
          if (poll.pollType === 'single') {
            return <PollCard key={poll._id} data={poll} />;
          } else {
            return <PollCardMultiple key={poll._id} data={poll} />;
          }
        })}
      </div>
    </div>
  );
};

export default Home;

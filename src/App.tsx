import { RouteMap } from './components/RouteMap';
import { RoutePlanner } from './components/route/RoutePlanner';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <RouteMap />
      <RoutePlanner />
    </div>
  );
}

export default App;

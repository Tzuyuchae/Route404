import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import FlightSearch from '../components/FlightSearch';
import FlightResults from '../components/FlightResults';

export default function SearchFlightsPage() {
  const [results, setResults] = useState(null);
  const location = useLocation();
  const { departure = '', arrival = '' } = location.state || {};

  return (
    <Layout>
      <div className="search-page">
        <h1 className="search-title">Find Your Perfect Flight <span className="emoji">✈️</span></h1>
        <FlightSearch
          defaultDeparture={departure}
          defaultArrival={arrival}
          onSearchResults={setResults}
        />
        {results?.flights?.length > 0 && <FlightResults data={results} />}
      </div>
    </Layout>
  );
}

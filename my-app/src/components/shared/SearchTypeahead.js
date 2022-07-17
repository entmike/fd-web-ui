import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
  'SBW45H5QPH',
  '735cfe2686474a143a610f864474b2f2'
);

function Hit({ hit }) {
  return (
    <article>
      <p>{hit.text_prompt}</p>
    </article>
  );
}

export default function SearchTypeahead() {
  return (
    <InstantSearch searchClient={searchClient} indexName="feverdreams">
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
}

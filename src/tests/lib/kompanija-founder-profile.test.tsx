import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import KompanijaPage, { metadata } from '@/app/kompanija/page';

test('kompanija page exposes a professional Nikola Spajić founder profile', () => {
  const markup = renderToStaticMarkup(<KompanijaPage />);

  assert(markup.includes('Nikola Spajić'), 'page must name Nikola Spajić');
  assert(
    markup.includes('Osnivač, developer i kreator digitalnog ekosistema Kompanije SPAJA'),
    'page must expose the founder-first professional positioning',
  );
  assert(
    markup.includes('Javni profil i interni governance sloj'),
    'page must explain the public versus internal governance split',
  );
  assert(
    markup.includes('Developer/Create metodologija'),
    'page must include the public-safe Developer/Create explanation',
  );
  assert(
    markup.includes('business@spaja.rs'),
    'page must include a business collaboration contact',
  );
  assert(
    markup.includes('"@type":"Person"') && markup.includes('"name":"Nikola Spajić"'),
    'page must emit Person structured data for Nikola Spajić',
  );
});

test('kompanija metadata stays founder-focused and professional', () => {
  assert.equal(
    metadata.title,
    'Nikola Spajić — Osnivač & CEO | Kompanija SPAJA',
    'metadata title must center the founder profile',
  );
  assert.equal(
    metadata.description,
    'Nikola Spajić je osnivač i CEO Kompanije SPAJA i nosilac Digitalne Industrije — profesionalan profil sa pregledom projekata, platformi, AI sistema i poslovne saradnje.',
    'metadata description must describe Nikola Spajić professionally',
  );
});

import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import HomePage from '@/app/page';
import ExtrimliPricePage from '@/app/extrimli-price/page';
import EkosistemPage from '@/app/ekosistem/page';
import { getPagePrompts } from '@/lib/ai-page-prompts';
import {
  DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE,
  DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK,
} from '@/lib/developer-create-vrh-mape-uma-contract';

test('global explanation block is visible on representative pages', () => {
  const homeMarkup = renderToStaticMarkup(<HomePage />);
  const extrimliMarkup = renderToStaticMarkup(<ExtrimliPricePage />);
  const ekosistemMarkup = renderToStaticMarkup(<EkosistemPage />);

  assert(homeMarkup.includes(DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE), 'home page must include global explanation title');
  assert(extrimliMarkup.includes(DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE), 'extrimli page must include global explanation title');
  assert(ekosistemMarkup.includes(DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE), 'general page must include global explanation title');

  assert(homeMarkup.includes(DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK), 'home page must include canonical MAPE UMA scope lock');
  assert(extrimliMarkup.includes(DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK), 'extrimli page must include canonical MAPE UMA scope lock');
  assert(ekosistemMarkup.includes(DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK), 'general page must include canonical MAPE UMA scope lock');
});

test('AI page prompts fallback carries Developer/Create + VRH + Mape Uma explanation', () => {
  const fallbackPrompts = getPagePrompts('/nepoznata-ruta');
  assert(
    fallbackPrompts.promptovi.some((item) => item.pitanje.includes('DEVELOPER AND CREATE + VRH PROGRAMSKOG EKVILADENTA + MAPE UMA')),
    'fallback prompts must include Developer/Create + VRH + Mape Uma explanation prompt',
  );
  assert(
    fallbackPrompts.kontekst.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA'),
    'fallback context must include canonical MAPE UMA scope lock',
  );
});

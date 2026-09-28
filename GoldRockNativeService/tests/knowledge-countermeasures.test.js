import test from 'node:test';
import assert from 'node:assert/strict';
import {countermeasureConcepts,countermeasureSources} from '../shared/knowledge-countermeasures.js';
import {getKnowledge,listKnowledge,searchKnowledge} from '../shared/knowledge.js';
import {getSource,sources} from '../shared/sources.js';

const now=new Date('2026-09-28T12:00:00Z');
const ids=['medicaid-care-before-application','hipaa-existing-billing-records','collector-stop-contact-versus-dispute'];

test('three new native countermeasures are unique and backed by current official sources',()=>{
  assert.ok(listKnowledge({now}).length>=109);
  assert.equal(new Set(listKnowledge({now}).map(record=>record.id)).size,listKnowledge({now}).length);
  assert.equal(new Set(sources.map(source=>source.id)).size,sources.length);
  for(const id of ids){
    const record=getKnowledge(id,{now});
    assert.equal(record.current,true,id);
    assert.ok(record.actions.length>=3&&record.verify.length>=3&&record.avoid.length>=2,id);
    assert.equal(record.reviewedAt,'2026-09-28T00:00:00.000Z');
    assert.ok(record.handoffRefs[0].lines[1]<=21);
    for(const sourceId of record.sourceIds)assert.equal(getSource(sourceId,{now})?.current,true,`${id}: ${sourceId}`);
  }
  assert.deepEqual(countermeasureSources.slice(-3).map(source=>source.id),[
    'medicaid-retroactive-eligibility','hhs-hipaa-billing-record-access','cfpb-collector-stop-contact'
  ]);
  for(const source of countermeasureSources.slice(-3)){
    assert.equal(source.reviewedAt,'2026-09-28T00:00:00.000Z');
    assert.match(new URL(source.url).hostname,/^(?:www\.)?(?:medicaid\.gov|hhs\.gov|consumerfinance\.gov)$/);
  }
});

test('matching keeps Medicaid and collector routes separate while billing-record access remains general',()=>{
  const search=(query,coverage)=>searchKnowledge(query,{now,limit:256,facts:{documentType:'bill',goal:'check',coverage}}).map(record=>record.id);
  assert.ok(search('retroactive Medicaid','uninsured').includes(ids[0]));
  assert.ok(!search('retroactive Medicaid','private').includes(ids[0]));
  assert.ok(search('HIPAA billing records','private').includes(ids[1]));
  assert.ok(search('HIPAA billing records','medicare').includes(ids[1]));
  assert.ok(search('stop collector calls','medicaid').includes(ids[2]));
});

test('new routes withhold action guidance outside their review period',()=>{
  for(const date of [new Date('2026-09-27T12:00:00Z'),new Date('2027-01-01T12:00:00Z')]){
    for(const id of ids){
      const record=getKnowledge(id,{now:date});
      assert.equal(record.current,false,id);
      assert.deepEqual(record.actions,[]);
      assert.deepEqual(record.verify,[]);
      assert.ok(record.sourceIds.length);
    }
  }
});

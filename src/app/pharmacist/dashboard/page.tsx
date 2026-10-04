'use client';

// The role root page already renders AppLayout; re-export so `/pharmacist/dashboard`
// renders identical content without nesting a second sidebar/header.
export { default } from '../../page';

export const isNostrAvailable = () => typeof window !== 'undefined' && !!window.nostr;

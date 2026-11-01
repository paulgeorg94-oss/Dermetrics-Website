// The signet path comes from the mount point (data-signet), relative to the page.
let signetSrc = ''
export const setSignet = (src: string) => { signetSrc = src }
export const SIGNET = () => signetSrc

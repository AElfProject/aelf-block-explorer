//global routes guard
export function guard(location, navigate) {
  const { pathname } = location;
  //Compatible with old url
  if (pathname.indexOf("viewer") > -1) {
    const hash = location.hash;
    const route = hash.split("/")[1];
    let url = "";
    if (pathname.indexOf("proposal") > -1) {
      url = `/proposal/${route}`;
    } else {
      const item = hash.split("/")[2];
      url = `/${route}/${item}`;
    }
    navigate(url);
    return false;
  }
  return true;
}

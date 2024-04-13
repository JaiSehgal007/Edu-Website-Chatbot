// utils.js

export const getCsrfToken = () => {
    const cookieString = document.cookie;
    const cookieArray = cookieString.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();
      if (cookie.startsWith('csrftoken=')) {
        return cookie.substring('csrftoken='.length, cookie.length);
      }
    }
    return null;
  };
  
/*
document.getElementById('test-button').addEventListener('click', function(){
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);
});
*/
{

  const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorList: Handlebars.compile(document.querySelector('#template-author-list').innerHTML),

  }

  const titleClickHandler = function(event){
    // console.log('Link was clicked!');
    // console.log('Event info:', event);

    event.preventDefault();

    /* [DONE] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */

    const clickedElement = this;
    // console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.posts .active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */

    const articleSelector = clickedElement.getAttribute('href');
    // console.log('articleSelector:', articleSelector);

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */

    const targetArticle = document.querySelector(articleSelector);
    // console.log('targetArticle:', targetArticle);

    /* [DONE] add class 'active' to the correct article */

    const activeArticle = this;
    // console.log('activeArticle:', activeArticle);
    targetArticle.classList.add('active');

  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags .list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector = '.authors .list';

  function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */

    const titleList = document.querySelector(optTitleListSelector);

    /* for each article */

    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for(let article of articles){

      /* get the article id */

      const articleId = article.getAttribute('id');

      /* find the title element */

      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* get the title from the title element */

      // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);

      /* insert link into titleList */

      html = html + linkHTML;
      // console.log(html);
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }

  }

  generateTitleLinks();

  function calculateTagsParams(tags){

    const params = {'min': 1 , 'max': 5 };

    for(let tag in tags){

      if(tags[tag] > params.max){

        params.max = tags[tag];

      }

      // console.log(tag + ' is used ' + tags[tag] + ' times');
    }

    return params;
  }

  function calculateTagClass(count , params){

    const normalizedCount = count - params.min;

    const normalizedMax = params.max - params.min;

    const percentage = normalizedCount / normalizedMax;

    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

    return optCloudClassPrefix + classNumber;

  }

  function generateTags(){

    /* [NEW] create a new variable allTags with an empty object */

    let allTags = {};

    /* find all articles */

    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */

    for(let article of articles){

      /* find tags wrapper */

      const wrapperTags = article.querySelector(optArticleTagsSelector);

      /* make html variable with empty string */

      let html = '';

      /* get tags from data-tags attribute */

      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */

      const articleTagsArray = articleTags.split(' ');
      // console.log(articleTagsArray);

      /* START LOOP: for each tag */

      for(let tag of articleTagsArray){


        /* generate HTML of the link */
        // const linkTags = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        const linkHTMLData = {tag: tag};
        const linkTags = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */

        html = html + linkTags;
        // console.log(html);

        /* [NEW] check if this link is NOT already in allTags */

        if(!allTags[tag]){

          /* [NEW] add generated code to allTags object */

          allTags[tag] = 1;
        }
        else {
          allTags[tag]++;
        }

      /* END LOOP: for each tag */
      }

      /* insert HTML of all the links into the tags wrapper */

      wrapperTags.innerHTML = html;
      // console.log(wrapperTags);

    /* END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */

    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams(allTags);
    // console.log('tagsParams:', tagsParams)

    /* [NEW] create variable for all links HTML code */
    // let allTagsHTML = '';
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */

    for(let tag in allTags){

      /* [NEW] generate code of a link and add it to allTagsHTML */

       // allTagsHTML +='<li><a href="#tag-' + tag + '"' + ' class="' + calculateTagClass(allTags[tag], tagsParams) + '"' + '">' + tag + '</a></li>';

      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });

      /* [NEW] END LOOP: for each tag in allTags: */
    }

    /*[NEW] add HTML from allTagsHTML to tagList */
    // tagList.innerHTML = allTagsHTML;
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }

  generateTags();

  function tagClickHandler(event){

    /* prevent default action for this event */

    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */

    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */

    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */

    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */

    const tagLinksActive = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */

    for(let tagActive of tagLinksActive){

      /* remove class active */

      tagActive.classList.remove('active');

    /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */

    const tagLinksAll = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */

    for(let tagLink of tagLinksAll){

      /* add class active */

      tagLink.classList.add('active');

    /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */

    generateTitleLinks('[data-tags~="' + tag + '"]');

  }

  function addClickListenersToTags(){

    /* find all links to tags */

    const tagAllLinks = document.querySelectorAll('.post-tags .list a, .list.tags a');

    /* START LOOP: for each link */

    for(let eachLink of tagAllLinks){

      /* add tagClickHandler as event listener for that link */

      eachLink.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
    }
  }

  addClickListenersToTags();

  function generateAuthors() {

    // create a new variable allAuthors with an empty object
    let allAuthors = {};

    // find all articles
    const articles = document.querySelectorAll(optArticleSelector);

    //  for each article
    for(let author of articles){

      // find author wrapper
      const wrapperAuthor = author.querySelector(optArticleAuthorSelector);

      // make html variable with empty string
      let html = '';

      // get author from data-author attribute
      const articleAuthor = author.getAttribute('data-author');

      // generate HTML of the link
       // const linkAuthor = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
      const linkHTMLData = {author: articleAuthor};
      const linkAuthor = templates.authorLink(linkHTMLData);

      // add generated code to html variable
      html = html + linkAuthor;

      // check if this link is NOT already in allAuthors
      if(!allAuthors[articleAuthor]){

        // add generated code to allAuthors object
        allAuthors[articleAuthor] = 1;
      }
      else {
        allAuthors[articleAuthor]++;
      }

      // insert HTML of the links into the author wrapper
      wrapperAuthor.innerHTML = html;
    }

    // find list of authors in right column
    const authorList = document.querySelector('.authors');

    // create variable for all links HTML code
    // let allAuthorsHTML = '';
    const allAuthorsData = {authors: []};

    // for each author in allAuthors:
    for(let author in allAuthors){

      // generate code of a link and add it to allAuthorsHTML
      // allAuthorsHTML += '<li>' + author + '(' + allAuthors[author] + ')' + '</li>';
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });

    }
    // add HTML from allAuthorsHTML to authorList
    // authorList.innerHTML = allAuthorsHTML;

    console.log(allAuthorsData);
    authorList.innerHTML = templates.authorList(allAuthorsData);
  }

  generateAuthors();

  function authorClickHandler(event){

    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');

    const author = href.replace('#author-', '');

    const authorLinksActive = document.querySelectorAll('a.active[href^="#author-"]');

    for(let authorActive of authorLinksActive){

      authorActive.classList.remove('active');

    }

    const authorLinksAll = document.querySelectorAll('a[href="' + href + '"]');

    for(let authorLink of authorLinksAll){

      authorLink.classList.add('active');

    }

    generateTitleLinks('[data-author="' + author + '"]');

  }

  function addClickListenersToAuthors() {

    const authorAllLinks = document.querySelectorAll('.post-author a, .list.authors a');

    for(let eachLink of authorAllLinks){

      eachLink.addEventListener('click', authorClickHandler);

    }
  }

  addClickListenersToAuthors();

}

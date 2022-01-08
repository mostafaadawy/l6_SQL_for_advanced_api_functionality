import { Article, ArticleStore } from '../article';

const article = new ArticleStore()

describe("Book Model", () => {
  it('should have an index method', () => {
    expect(article.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(article.index).toBeDefined();
  });

  it('should have a create method', () => {
    expect(article.index).toBeDefined();
  });

  it('should have a update method', () => {
    expect(article.index).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(article.index).toBeDefined();
  });

  it('create method should add a book', async () => {
    const result = await article.create({
  title: 'Bridge to Terabithia',
  content: "content" as unknown as Text
});
    expect(result).toEqual({
      id: "1",
      title:"Bridge to Terabithia",
      content: "content" as unknown as Text
    });
  });

  it('index method should return a list of books', async () => {
    const result = await article.index();
    expect(result).toEqual([{
      id: "1",
      title: 'Bridge to Terabithia',
      content: "content" as unknown as Text
    }]);
  });

  it('show method should return the correct book', async () => {
    const result = await article.show("1");
    expect(result).toEqual({
      id: "1",
      title: 'Bridge to Terabithia',
      content: "content" as unknown as Text
    });
  });

  it('delete method should remove the book', async () => {
    article.delete("1");
    const result = await article.index()

    expect(result).toEqual([]);
  });
});

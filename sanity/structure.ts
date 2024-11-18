import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Shopply')
    .items([
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('order').title('Orders'),
      S.documentTypeListItem('sale').title('Sales'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['product', 'category', 'order', 'sale'].includes(item.getId()!)
      ),
    ]);

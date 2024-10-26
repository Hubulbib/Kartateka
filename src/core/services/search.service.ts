import { OrganizationRepository } from '../repositories/organization/organization.repository.js'
import { PostRepository } from '../repositories/post/post.repository.js'
import { type OrganizationEntitySearch } from '../entities/organization.entity.js'
import { type PostEntityShort } from '../entities/post.entity.js'

export class SearchService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly postRepository: PostRepository,
  ) {}

  globalSearch = async (
    queryText: string,
  ): Promise<{
    organizations: OrganizationEntitySearch[]
    posts: PostEntityShort[]
  }> => {
    return {
      organizations: await this.searchOrganization(queryText),
      posts: await this.searchPost(queryText),
    }
  }

  private searchOrganization = async (queryText: string): Promise<OrganizationEntitySearch[]> => {
    return await this.organizationRepository.searchByText(queryText)
  }

  private searchPost = async (queryText: string): Promise<PostEntityShort[]> => {
    return await this.postRepository.searchByText(queryText)
  }
}

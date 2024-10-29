import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call $connect on module init', async () => {
    // Spy on the $connect method of PrismaClient
    const connectSpy = jest.spyOn(prismaService, '$connect').mockResolvedValueOnce(undefined);

    await prismaService.onModuleInit();

    // Check if $connect was called during module initialization
    expect(connectSpy).toHaveBeenCalled();
  });


});

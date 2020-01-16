<?php

namespace App\Repository;

use App\Entity\AccessPass;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method AccessPass|null find($id, $lockMode = null, $lockVersion = null)
 * @method AccessPass|null findOneBy(array $criteria, array $orderBy = null)
 * @method AccessPass[]    findAll()
 * @method AccessPass[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AccessPassRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AccessPass::class);
    }

    // /**
    //  * @return AccessPass[] Returns an array of AccessPass objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?AccessPass
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

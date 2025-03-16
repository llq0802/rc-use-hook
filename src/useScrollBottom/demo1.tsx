import { useScrollBottom } from 'rc-use-hooks';
import React, { useRef } from 'react';

export default function Demo1() {
  const ref = useRef<HTMLDivElement>(null!);

  const bottomed = useScrollBottom(ref, {
    threshold: 50,
  });

  return (
    <>
      <p>bottomed： {JSON.stringify(bottomed)}</p>
      <div
        ref={ref}
        style={{
          border: '1px solid red',
          height: 300,
          overflowY: 'auto',
        }}
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
          voluptatum nihil, obcaecati recusandae non pariatur ad ea provident
          inventore quam quia? Labore corporis obcaecati vel magni autem sint
          adipisci quos. In officia quis molestias inventore mollitia, saepe
          odio dolorum ipsum animi modi quasi rerum corrupti, dolorem debitis
          deserunt voluptatem expedita! Voluptate dolorem aperiam eum quia omnis
          odit nesciunt amet consequatur? Soluta tempore, quas possimus libero,
          aspernatur odit iure vel quo cumque blanditiis modi eum explicabo ex,
          recusandae aliquid dolores? Officiis excepturi similique earum facilis
          exercitationem ullam unde, quas eum error. Molestias corrupti
          inventore ipsam quaerat, dolor quod aliquid iste at blanditiis porro
          commodi, dolore libero modi quisquam enim et sint a culpa. Dicta,
          cumque alias voluptas rem explicabo error. Dolore. Repudiandae,
          voluptatem commodi modi id a sint nesciunt nemo quisquam, iusto esse
          officiis quaerat dolorem ratione non ex deserunt explicabo optio.
          Aliquid corrupti placeat dignissimos ea iste repudiandae in explicabo.
          recusandae aliquid dolores? Officiis excepturi similique earum facilis
          exercitationem ullam unde, quas eum error. Molestias corrupti
          inventore ipsam quaerat, dolor quod aliquid iste at blanditiis porro
          commodi, dolore libero modi quisquam enim et sint a culpa. Dicta,
          cumque alias voluptas rem explicabo error. Dolore. Repudiandae,
          voluptatem commodi modi id a sint nesciunt nemo quisquam, iusto esse
          officiis quaerat dolorem ratione non ex deserunt explicabo optio.
          voluptatem commodi modi id a sint nesciunt nemo quisquam, iusto esse
          officiis quaerat dolorem ratione non ex deserunt explicabo optio.
          Aliquid corrupti placeat dignissimos ea iste repudiandae in explicabo.
          recusandae aliquid dolores? Officiis excepturi similique earum facilis
          exercitationem ullam unde, quas eum error. Molestias corrupti
          inventore ipsam quaerat, dolor quod aliquid iste at blanditiis porro
          commodi, dolore libero modi quisquam enim et sint a culpa. Dicta,
          cumque alias voluptas rem explicabo error. Dolore. Repudiandae,
          commodi, dolore libero modi quisquam enim et sint a culpa. Dicta,
          cumque alias voluptas rem explicabo error. Dolore. Repudiandae,
          voluptatem commodi modi id a sint nesciunt nemo quisquam, iusto esse
          officiis quaerat dolorem ratione non ex deserunt explicabo optio.
          voluptatem commodi modi id a sint nesciunt nemo quisquam, iusto esse
          officiis quaerat dolorem ratione non ex deserunt explicabo optio.
          Aliquid corrupti placeat dignissimos ea iste repudiandae in explicabo.
          recusandae aliquid dolores? Officiis excepturi similique earum facilis
          exercitationem ullam unde, quas eum error. Molestias corrupti
          inventore ipsam quaerat, dolor quod aliquid iste at blanditiis porro
          commodi, dolore libero modi quisquam enim et sint a culpa. Dicta,
          cumque alias voluptas rem explicabo error. Dolore. Repudiandae,
          voluptatem commodi modi id a sint nesciunt nemo quisquam, iusto esse
          officiis quaerat dolorem ratione non ex deserunt explicabo optio.
          Aliquid corrupti placeat dignissimos ea iste repudiandae in explicabo.
        </p>
      </div>
    </>
  );
}
